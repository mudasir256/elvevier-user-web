"use client";

import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import type { Product } from "@/types";
import { GUEST_KEY, readCartSnapshot, rememberGuestToken, writeCartSnapshot } from "@/lib/cartToken";
import { store } from "@/store/store";
import { cartApi } from "@/store/cartApi";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; product: Product; quantity?: number; size?: string }
  | { type: "REMOVE"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "SET"; items: CartItem[] }
  | { type: "MERGE_ITEMS"; items: CartItem[] }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id && item.size === action.size
      );
      const qty = action.quantity ?? 1;
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id && item.size === action.size
              ? { ...item, quantity: Math.min(20, item.quantity + qty) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: qty, size: action.size }],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((item) => item.product.id !== action.productId) };
    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId ? { ...item, quantity: Math.min(20, action.quantity) } : item
        ),
      };
    }
    case "SET":
      return { ...state, items: action.items };
    case "MERGE_ITEMS": {
      const merged = new Map(state.items.map((item) => [`${item.product.id}:${item.size ?? ""}`, item]));
      for (const item of action.items) merged.set(`${item.product.id}:${item.size ?? ""}`, item);
      return { ...state, items: [...merged.values()] };
    }
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  ready: boolean;
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function rememberGuest(data: { guestToken?: string }) {
  rememberGuestToken(data.guestToken);
}

async function pullCart() {
  const request = store.dispatch(cartApi.endpoints.getCart.initiate(undefined, { forceRefetch: true, subscribe: false }));
  try {
    const data = await request.unwrap();
    rememberGuest(data);
    return (data.items ?? []) as CartItem[];
  } finally {
    request.unsubscribe();
  }
}

async function sendCart<T>(request: { unwrap: () => Promise<T>; unsubscribe?: () => void }) {
  try {
    return await request.unwrap();
  } finally {
    request.unsubscribe?.();
  }
}

export function CartProvider({
  children,
  initialItems = [],
}: {
  children: React.ReactNode;
  initialItems?: CartItem[];
}) {
  const [state, dispatch] = useReducer(cartReducer, initialItems, (items) => ({
    items: items.filter((item) => item?.product?.id && item.product.image && item.quantity > 0),
    isOpen: false,
  }));
  const [ready, setReady] = useState(
    () => initialItems.some((item) => item?.product?.id && item.product.image && item.quantity > 0)
  );
  const generation = useRef(0);
  const queue = useRef(Promise.resolve());

  const run = useCallback((task: (current: number) => Promise<void>) => {
    const current = ++generation.current;
    queue.current = queue.current.then(() => task(current)).catch(() => undefined);
    return queue.current;
  }, []);

  const applyItems = useCallback((current: number, items: CartItem[]) => {
    if (current !== generation.current) return;
    dispatch({ type: "SET", items });
  }, []);

  const loadCart = useCallback(() => {
    run(async (current) => {
      try {
        const items = await pullCart();
        applyItems(current, items);
      } catch {
        // Keep the saved cart on screen if the refresh request fails.
      } finally {
        if (current === generation.current) setReady(true);
      }
    });
  }, [applyItems, run]);

  useLayoutEffect(() => {
    const snapshot = readCartSnapshot<CartItem>().filter(
      (item) => item?.product?.id && item.product.image && item.quantity > 0
    );
    if (snapshot.length) dispatch({ type: "SET", items: snapshot });
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener("empulse-customer", loadCart);
    const onStorage = (event: StorageEvent) => {
      if (event.key && event.key !== GUEST_KEY && event.key !== "empulse_customer") return;
      loadCart();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("empulse-customer", loadCart);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadCart]);

  useEffect(() => {
    if (!ready) return;
    writeCartSnapshot(state.items);
  }, [ready, state.items]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, size?: string) => {
      dispatch({ type: "ADD", product, quantity, size });
      run(async (current) => {
        try {
          const data = await sendCart(
            store.dispatch(
              cartApi.endpoints.addCartItem.initiate({
                productId: product.id,
                quantity,
                size: size ?? "",
              })
            )
          );
          rememberGuest(data);
          if (current === generation.current) applyItems(current, data.items ?? []);
          else dispatch({ type: "MERGE_ITEMS", items: data.items ?? [] });
        } catch {
          const items = await pullCart().catch(() => null);
          if (items) applyItems(current, items);
        }
      });
    },
    [applyItems, run]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      dispatch({ type: "REMOVE", productId });
      run(async (current) => {
        try {
          const data = await sendCart(store.dispatch(cartApi.endpoints.removeCartItem.initiate({ productId })));
          rememberGuest(data);
          applyItems(current, data.items ?? []);
        } catch {
          const items = await pullCart().catch(() => null);
          if (items) applyItems(current, items);
        }
      });
    },
    [applyItems, run]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", productId, quantity });
      run(async (current) => {
        try {
          const data = await sendCart(store.dispatch(cartApi.endpoints.updateCartItem.initiate({ productId, quantity })));
          rememberGuest(data);
          applyItems(current, data.items ?? []);
        } catch {
          const items = await pullCart().catch(() => null);
          if (items) applyItems(current, items);
        }
      });
    },
    [applyItems, run]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    return run(async (current) => {
      try {
        const data = await sendCart(store.dispatch(cartApi.endpoints.clearCartItems.initiate()));
        rememberGuest(data);
        applyItems(current, data.items ?? []);
      } catch {
        const items = await pullCart().catch(() => null);
        if (items) applyItems(current, items);
      }
    });
  }, [applyItems, run]);

  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const value: CartContextValue = {
    ...state,
    ready,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    itemCount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

import Image from "next/image";

import StatusPill from "./StatusPill";

import { useAuth } from "@/context/AuthContext";

export default function ItemCard({
  mode = "catalog",

  product,

  onEdit,
  onDelete,

  onReceiveStock,
  onDamageStock,
  onViewItems,
}) {
  const isCatalog = mode === "catalog";
  const isInventory = mode === "inventory";

  const { can } = useAuth();

  const canEdit = can("products.update");
  const canDelete = can("products.delete");

  const sellingPrice = Number(product.selling_price ?? 0);
  const costPrice = Number(product.cost_price ?? 0);

  const revenue = sellingPrice - costPrice;

  return (
    <div
      className="
        flex flex-row rounded-xl border border-gray-200 bg-white p-3 shadow-sm
        transition-shadow hover:shadow-md
        sm:flex-col sm:p-5
      "
    >
      {/* Product Image */}

      <div
        className="
          relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100
          sm:mb-5 sm:h-48 sm:w-full
        "
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Content */}

      <div className="flex min-w-0 flex-1 flex-col pl-3 sm:pl-0">
        {/* Product Name */}

        <h2
          className="
            line-clamp-2 text-base font-semibold leading-tight
            sm:text-xl
          "
          title={product.name}
        >
          {product.name}
        </h2>

        {/* Secondary Information */}

        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
          <p className="truncate text-xs text-gray-500 sm:text-sm">
            {product.brands?.name ?? "No Brand"}
          </p>

          <span className="text-gray-300">•</span>

          <p className="truncate text-xs text-gray-500 sm:text-sm">
            {product.categories?.name ?? "No Category"}
          </p>
        </div>

        <p className="mt-0.5 truncate text-xs text-gray-400 sm:mt-1 sm:text-sm">
          SKU: {product.sku || "-"}
        </p>

        {/* Pricing */}

        <div
          className="
            mt-3 grid grid-cols-2 gap-3
            sm:mt-4 sm:block sm:space-y-2
          "
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
              Selling Price
            </p>

            <p className="text-base font-semibold sm:text-lg">
              ₱{sellingPrice.toLocaleString()}
            </p>
          </div>

          {isCatalog && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
                Revenue
              </p>

              <p className="text-base font-semibold sm:text-lg">
                ₱{revenue.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Inventory Status */}

        {isInventory && (
          <div className="mt-3 sm:mt-4">
            <StatusPill stock={product.stock} />
          </div>
        )}

        {/* Actions */}

        <div className="mt-3 sm:mt-auto sm:space-y-4 sm:pt-5">
          {isInventory && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onReceiveStock?.(product)}
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Receive
                </button>

                <button
                  type="button"
                  onClick={() => onDamageStock?.(product)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Damage
                </button>
              </div>

              <button
                type="button"
                onClick={() => onViewItems?.(product)}
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                View Items
              </button>
            </div>
          )}

          {isCatalog && (canEdit || canDelete) && (
            <div className="flex gap-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onEdit?.(product)}
                  className="flex-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 sm:px-3 sm:py-2 sm:text-sm"
                >
                  Edit
                </button>
              )}

              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete?.(product)}
                  className="flex-1 rounded-lg bg-red-600 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 sm:px-3 sm:py-2 sm:text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

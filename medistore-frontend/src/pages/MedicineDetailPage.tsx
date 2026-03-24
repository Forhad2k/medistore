import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, Package, ChevronLeft, Plus, Minus } from "lucide-react";
import { Medicine, Review } from "../types";
import { medicinesApi } from "../api/medicines";
import { reviewsApi, ReviewsResponse } from "../api/reviews";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice, formatDate, getErrorMessage } from "../utils";
import MainLayout from "../components/layout/MainLayout";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import StarRating from "../components/common/StarRating";
import Badge from "../components/common/Badge";
import { getStatusColor } from "../utils";
import toast from "react-hot-toast";

const MedicineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [medicine, setMedicine] = useState<Medicine & { reviews?: Review[] } | null>(null);
  const [reviewData, setReviewData] = useState<ReviewsResponse | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [medRes, revRes] = await Promise.all([
          medicinesApi.getById(id),
          reviewsApi.getByMedicine(id),
        ]);
        setMedicine(medRes.data.data as Medicine);
        setReviewData(revRes.data.data);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const submitReview = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      await reviewsApi.create(id, reviewForm);
      const res = await reviewsApi.getByMedicine(id);
      setReviewData(res.data.data);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted!");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  };

  if (loading) return <MainLayout><Spinner size={32} className="py-40" /></MainLayout>;
  if (!medicine) return <MainLayout><div className="text-center py-40 text-gray-500">Medicine not found</div></MainLayout>;

  const canBuy = !user || user.role === "CUSTOMER";

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-6 transition-colors">
          <ChevronLeft size={15} /> Back to shop
        </Link>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden h-80 md:h-96 flex items-center justify-center">
            {medicine.imageUrl ? (
              <img src={medicine.imageUrl} alt={medicine.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={64} className="text-gray-700" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <Badge className="text-brand-400 bg-brand-500/10 border-brand-500/20 mb-3">
                {medicine.category.name}
              </Badge>
              <h1 className="font-display text-3xl font-bold text-gray-100 leading-tight">{medicine.name}</h1>
              {medicine.manufacturer && (
                <p className="text-gray-500 mt-1">by <span className="text-gray-400">{medicine.manufacturer}</span></p>
              )}
            </div>

            {reviewData && reviewData.averageRating && (
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(reviewData.averageRating)} />
                <span className="text-sm text-gray-400">{reviewData.averageRating} ({reviewData.totalReviews} reviews)</span>
              </div>
            )}

            {medicine.description && (
              <p className="text-gray-500 text-sm leading-relaxed">{medicine.description}</p>
            )}

            <div className="flex items-center gap-4 py-4 border-y border-surface-border">
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Price</p>
                <p className="font-display text-3xl font-bold text-brand-400">{formatPrice(medicine.price)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Stock</p>
                <p className={`text-sm font-semibold ${medicine.stock > 0 ? "text-brand-400" : "text-red-400"}`}>
                  {medicine.stock > 0 ? `${medicine.stock} available` : "Out of stock"}
                </p>
              </div>
            </div>

            {/* Sold by */}
            <p className="text-sm text-gray-600">
              Sold by <span className="text-gray-400 font-medium">{medicine.seller.name}</span>
            </p>

            {/* Add to cart */}
            {canBuy && medicine.stock > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-surface-border rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-surface-hover text-gray-400 hover:text-gray-200 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-200 min-w-[40px] text-center">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(medicine.stock, q + 1))}
                    className="px-3 py-2 hover:bg-surface-hover text-gray-400 hover:text-gray-200 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <Button onClick={() => addToCart(medicine, qty)} icon={<ShoppingCart size={15} />} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-surface-border pt-10">
          <h2 className="font-display text-xl font-bold text-gray-100 mb-6">
            Customer Reviews {reviewData && <span className="text-gray-600 font-sans font-normal text-base">({reviewData.totalReviews})</span>}
          </h2>

          {/* Write a Review */}
          {user?.role === "CUSTOMER" && (
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-8">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Write a Review</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Your Rating</p>
                  <StarRating rating={reviewForm.rating} interactive onChange={(r) => setReviewForm((p) => ({ ...p, rating: r }))} size={20} />
                </div>
                <textarea
                  placeholder="Share your experience (optional)..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                  rows={3}
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500/50 resize-none"
                />
                <Button onClick={submitReview} loading={submitting} size="sm" className="self-start">
                  Submit Review
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewData && reviewData.reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {reviewData.reviews.map((review) => (
                <div key={review.id} className="bg-surface-card border border-surface-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-brand-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-400 text-xs font-bold">{review.customer.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">{review.customer.name}</p>
                        <p className="text-xs text-gray-600">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm py-8 text-center">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicineDetailPage;

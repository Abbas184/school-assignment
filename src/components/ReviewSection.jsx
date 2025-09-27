"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';
import { FaEdit, FaTrash } from 'react-icons/fa';

// This is the sub-component for displaying a single review
function ReviewItem({ review, session, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment);
  const [editedRating, setEditedRating] = useState(review.rating);

  const handleUpdate = () => {
    onEdit(review._id, editedComment, editedRating);
    setIsEditing(false);
  };

  const isOwner = session?.user?.id === review.user._id;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">{review.user?.name || "Anonymous"}</p>
        {!isEditing && <StarRating rating={review.rating} />}
      </div>
      {isEditing ? (
        <div className="mt-2">
          <select value={editedRating} onChange={(e) => setEditedRating(Number(e.target.value))} className="w-full p-2 border rounded-md mb-2">
            <option value={5}>5 - Excellent</option><option value={4}>4 - Good</option><option value={3}>3 - Average</option><option value={2}>2 - Poor</option><option value={1}>1 - Terrible</option>
          </select>
          <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} className="w-full p-2 border rounded-md" />
          <div className="flex space-x-2 mt-2">
            <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Save</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mt-1">{review.comment}</p>
      )}
      <div className="flex items-center space-x-4 mt-2">
        {isOwner && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 hover:underline flex items-center"><FaEdit className="mr-1" /> Edit</button>
        )}
        {(isOwner || isAdmin) && !isEditing && (
          <button onClick={() => onDelete(review._id)} className="text-xs text-red-600 hover:underline flex items-center"><FaTrash className="mr-1" /> Delete</button>
        )}
      </div>
    </div>
  );
}

// This is the main component that manages the list of reviews
export default function ReviewSection({ schoolId }) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/reviews?schoolId=${schoolId}`);
    const data = await res.json();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [schoolId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, rating, schoolId }) });
    if (res.ok) {
      toast.success("Review submitted!");
      setComment(''); setRating(5);
      fetchReviews();
    } else {
      toast.error("Failed to submit review.");
    }
  };

  const handleEditReview = async (reviewId, newComment, newRating) => {
    const res = await fetch(`/api/reviews/${reviewId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment: newComment, rating: newRating }) });
    if (res.ok) {
      toast.success("Review updated!");
      fetchReviews();
    } else {
      toast.error("Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Delete this review?")) {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Review deleted!");
        fetchReviews();
      } else {
        toast.error("Failed to delete review.");
      }
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Reviews</h2>
      
      {status === "authenticated" && (
        <form onSubmit={handleSubmitReview} className="mb-6 border-b pb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Leave your Review</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-800">Your Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full p-2 border rounded-md">
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Terrible</option>
            </select>
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." required className="w-full p-2 border rounded-md"></textarea>
          <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Submit Review</button>
        </form>
      )}

      {status === "unauthenticated" && (
        <div className="text-center py-4 border-b mb-6">
          <p className="text-gray-600 mb-4">Want to share your experience?</p>
          <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
            Login to Leave a Review
          </Link>
        </div>
      )}

      {isLoading ? <p className="text-gray-600">Loading reviews...</p> : (
        <div className="space-y-4">
          {reviews.length > 0 ? reviews.map(review => (
            <ReviewItem 
              key={review._id} 
              review={review} 
              session={session} 
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          )) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
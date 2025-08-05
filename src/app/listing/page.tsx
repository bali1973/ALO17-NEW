'use client';

import React, { useState, useEffect } from 'react';

import { MapPin, Calendar, Eye, Heart, Share2 } from 'lucide-react';

export default function ListingPage() {
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/1`); // Replace with actual listing ID
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
      <p className="text-lg text-gray-800 mb-4">{listing.description}</p>
      <p className="text-lg text-gray-800 mb-4">Price: {listing.price}</p>
      <p className="text-lg text-gray-800 mb-4">Location: {listing.location}</p>
      <p className="text-lg text-gray-800 mb-4">Posted on: {new Date(listing.createdAt).toLocaleDateString()}</p>
      <p className="text-lg text-gray-800 mb-4">Contact: {listing.contact}</p>

      <div className="flex items-center mt-6 text-gray-600 text-sm">
        <MapPin className="mr-2" />
        {listing.location}
      </div>

      <div className="flex items-center mt-4 text-gray-600 text-sm">
        <Calendar className="mr-2" />
        {new Date(listing.createdAt).toLocaleDateString()}
      </div>

      <div className="flex items-center mt-4 text-gray-600 text-sm">
        <Eye className="mr-2" />
        {listing.views} views
      </div>

      <div className="flex items-center mt-4 text-gray-600 text-sm">
        <Heart className="mr-2" />
        {listing.likes} likes
      </div>

      <div className="flex items-center mt-4 text-gray-600 text-sm">
        <Share2 className="mr-2" />
        Share
      </div>
    </div>
  );
} 

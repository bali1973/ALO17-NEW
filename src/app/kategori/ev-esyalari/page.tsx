'use client'

import { FaHome } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  { id: 'mobilya', name: 'Mobilya', icon: <FaHome className="inline mr-2 text-orange-500" /> },
  { id: 'dekorasyon', name: 'Dekorasyon', icon: <FaHome className="inline mr-2 text-orange-500" /> },
  { id: 'mutfak', name: 'Mutfak Gereçleri', icon: <FaHome className="inline mr-2 text-orange-500" /> },
]

const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/ev-esyalari/${subcategory.id}`}
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                      selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {subcategory.icon}{subcategory.name}
                  </Link>
                ))} 
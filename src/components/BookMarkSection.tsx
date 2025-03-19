"use client"
import React, { useState } from 'react'
import useSWR from 'swr';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

const rowsPerPage = 3;

interface IBookmarkProps {
    _id: string;
    blogId: {
        _id: string;
        title: string;
    }
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function BookMarkSection() {
    const [currentPage, setCurrentPage] = useState(1);
  const { data, error } = useSWR("/api/bookmark", fetcher)

//   console.log("data", data.bookmarks);

  if (error) {
    return <p className="text-red-500">Error loading bookmarks...</p>;
  }
  

  const bookmark: IBookmarkProps[] = data?.bookmarks || [];
  const totalPages = Math.ceil(bookmark.length / rowsPerPage);

  const currentData = bookmark.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  return (
    <div className='w-full max-w-6xl mx-auto shadow-lg p-6 rounded-lg border'>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className='text-right'>View</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    currentData.map((bookmark) => (
                        <TableRow key={bookmark._id}>
                            <TableCell className='font-semibold'>{bookmark.blogId.title}</TableCell>
                            <TableCell className='text-right'>
                                <Link href={`/blog/${bookmark.blogId._id}`} className='bg-green-500 text-white px-3 py-1 rounded'>View</Link>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className='mt-4'>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                    href='#'
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
                {
                    [...Array(totalPages)].map((_, index) => (
                        <PaginationItem>
                            <PaginationLink
                            href='#'
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))
                }

                <PaginationItem>
                    <PaginationNext
                    href='#'
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    </div>
  )
}

import React from 'react'
import type { NGO } from '@/utils/types'

interface CardProps {
    title: string
    organization: string
}
export default function Card({ title, organization }: CardProps) {
    const orgObject = JSON.parse(organization) as NGO;

    return (
        <div className="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div className="p-6">
                <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                    {title}
                </h5>
                <address className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                    {orgObject.Street}, {orgObject.City}, {orgObject.ZipCode}
                </address>
            </div>
        </div>
    )
}

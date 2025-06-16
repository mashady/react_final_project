"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import banner from '../../../../../public/banner.jpg'
import owner from '../../../../../public/owner.jpg'
import Image from 'next/image'
import axios from 'axios'
import PropertyCard from '@/components/shared/PropertyCard'
const page = () => {

  const [userProfile, setUserProfile] = useState({})
  const [id, setId] = useState(useParams().id)
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = () => {
    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      console.log(res.data.data)
      setUserProfile({
        name: res.data.data.name,
        bio: res.data.data.owner_profile.bio,
        image: 'https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/agent2-profile-img-new-409x409.jpg',
        email: res.data.data.email,
        phone: res.data.data.owner_profile.phone_number,
        whatsapp: res.data.data.owner_profile.whatsapp_number,
        address: res.data.data.owner_profile.address,
        properties: res.data.data.ads 
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  //image: `http://localhost:8000/api/${res.data.data.owner_profile.picture}`

  return (
   <>
    <section className='conatiner w-[98%] mx-auto my-10'>
      <Image src={banner} alt="Page Banner" className="" />
    </section>
    <section id="profileContainer" className='w-[72%] mx-auto flex space-x-5'>
      <section id="leftSide" className=''>
        <article id="infoCard" className='bg-[#edf9f9] relative top-[-80px] rounded-sm flex flex-col justify-center items-center px-5 py-5 space-y-3'>
          <section id="profileImage" className=' '>
            <img src={userProfile.image} alt="owner image" className='rounded-sm' /> 
          </section>
          <section id="ownerInfo" className='my-6 space-y-3 w-full'>
            <div className='flex justify-between border-b-1 border-gray-200 py-2'>
              <p className='text-gray-600'> Address:</p>
              <p> {userProfile.address} </p>
            </div>
            <div className='flex justify-between border-b-1 border-gray-200 py-2'>
              <p className='text-gray-600'> Phone:</p>
              <p> {userProfile.phone || "NO Phone Number"} </p>
            </div>
            <div className='flex justify-between border-b-1 border-gray-200 py-2'>
              <p className='text-gray-600'> WhatsApp:</p>
              <p> {userProfile.whatsapp || "NO WhatsApp Number"} </p>
            </div>
            <div className='flex justify-between py-2'>
              <p className='text-gray-600'> Email:</p>
              <p> {userProfile.email} </p>
            </div>
          </section>
        </article>
      </section>
      <section id="rightSide" >
        <article id="ownerProfile" className='w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm'>
          <h3 className='text-5xl font-medium mb-8'> {userProfile.name} </h3>
          <p className='text-gray-500 my-2'> {userProfile.bio} </p>
        </article>
        <article id="ownerProperties" className='w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm mt-5'>
          <h3 className='text-3xl font-medium mb-8'> Our Listing </h3>
          <div>
            { userProfile.properties ? userProfile.properties.map((property, index) => (
              <PropertyCard
                key={index}
                image={property.image}
                status={property.status}
                location={property.location}
                title={property.title}
                description={property.description}
                price={property.price}
                currency={property.currency}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                onClick={() => router.push(`/property/${property.id}`)}
              />
            )) : <p>No properties found</p>}
          </div>
        </article>
      </section>
    </section>
   </>
  )
}

export default page






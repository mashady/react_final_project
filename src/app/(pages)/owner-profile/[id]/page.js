"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import banner from '../../../../../public/banner.jpg'
import owner from '../../../../../public/owner.jpg'
import Image from 'next/image'
const page = () => {

  const [userProfile, setUserProfile] = useState({})

  useEffect(() => {
    setUserProfile({
      name: "Abdelwahab Saeed",
      bio: "Lorem ipsum dolor sit amet, pri eu denique concludaturque, qui eros utinam luptatum an, sumo nibh tantas in vis. Mel possim invenire expetendis ne, ut verear neglegentur mel. Usu cu dictas nostrum constituam, eu timeam ceteros delicata nec. In vis nostro oporteat, pri ut vide debet aeque, nec invenire referrentur eu tantas mentitum. ",
      image: owner,
      email: "abdo@gmail.com",
      phone: "01025332000",
      address: "Cairo, Egypt",
    })
  }, [])

  return (
   <>
    <section className='conatiner w-[98%] mx-auto my-10'>
      <Image src={banner} alt="Page Banner" className="" />
    </section>
    <section id="profileContainer" className='w-[72%] mx-auto flex space-x-5'>
      <section id="leftSide" className=''>
        <article id="infoCard" className='bg-[#edf9f9] rounded-sm flex flex-col justify-center items-center px-5 py-5 space-y-3'>
          <section id="profileImage" className=' '>
            <Image src={userProfile.image} alt="owner image" className='rounded-sm' /> 
          </section>
          <section id="ownerInfo" className='my-6'>
            <div className='flex  space-x-60 border-b-1 border-gray-200 py-2'>
              <p className='text-gray-600'> Address:</p>
              <p> {userProfile.address} </p>
            </div>
            <div className='flex  space-x-60 border-b-1 border-gray-200 py-2'>
              <p className='text-gray-600'> Phone:</p>
              <p> +2{userProfile.phone} </p>
            </div>
            <div className='flex  space-x-60 py-2'>
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
            
          </div>
        </article>
      </section>
    </section>
   </>
  )
}

export default page






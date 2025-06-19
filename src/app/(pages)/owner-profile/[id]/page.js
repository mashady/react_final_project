"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import banner from "../../../../../public/banner.jpg";
import owner from "../../../../../public/owner.jpg";
import Image from "next/image";
import axios from "axios";
import PropertyCard from "@/components/shared/PropertyCard";
const page = () => {
  const [userProfile, setUserProfile] = useState({});
  const [id, setId] = useState(useParams().id);
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    axios
      .get(`http://localhost:8000/api/users/${id}`)
      .then((res) => {
        console.log(res.data.data.ads);
        setUserProfile({
          ads: res.data.data.ads || [],
          name: res.data.data.name || "No Name",
          bio: res.data.data.owner_profile.bio || "No Bio",
          image: `https://secure.gravatar.com/avatar/2e4f394b7744b481c1a87797f8a5cf2021d287bd1fe66bcfe0115a21fd1f709b?s=341&d=mm&r=g`,
          email: res.data.data.email || "No Email",
          phone: res.data.data.owner_profile.phone_number  || "No Phone Number",
          whatsapp: res.data.data.owner_profile.whatsapp_number || "No WhatsApp Number",
          address: res.data.data.owner_profile.address || "No Address",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <section className="conatiner w-[98%] mx-auto my-10">
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
        <section id="rightSide">
          <article
            id="ownerProfile"
            className="w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm"
          >
            <h3 className="text-5xl font-medium mb-8"> {userProfile.name} </h3>
            <p className="text-gray-500 my-2"> {userProfile.bio} </p>
          </article>
          <article
            id="ownerProperties"
            className="w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm mt-5"
          >
            <h3 className="text-3xl font-medium mb-8"> Our Listing </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile?.ads?.map((property, i) => (
                <PropertyCard key={i} property={property} />
              ))}
            </div>
          </article>
        </section>
      </section>
    </>
  );
};

export default page;

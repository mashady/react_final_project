"use client";

export default function PricingHeader() {
    return ( <
        div className = "relative bg-gray-800 text-white" >
        <
        div className = "absolute inset-0" >
        <
        img src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
        alt = "Woman working on laptop"
        className = "w-full h-full object-cover opacity-60" /
        >
        { /* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */ } <
        /div> <
        div className = "relative px-6 py-24 text-center" >
        <
        h1 className = "text-5xl md:text-6xl font-bold mb-4" > Pricing Package < /h1> < /
        div > <
        /div>
    );
}
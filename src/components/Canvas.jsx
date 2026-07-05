import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";

const Canvas = () => {
    
    const [imageLoaded, setImageLoaded] = useState(0) ;
    const imgArr = useRef([]) ;
    const canvasRef = useRef(null)  ;
    
    gsap.registerPlugin(ScrollTrigger);

    const frames = useRef( {
        currentIndex : 0 , 
        maxIndex : 382 ,
    } )

    const preloadImages = () => 
        {
            const arr = [] ;
            for (let i = 0 ; i < frames.current.maxIndex ; i++)
            {
                const imgUrl = `./ImageFrames/frame_${  (i+1).toString().padStart(4,"0")  }.jpeg` ;
                
                const img = new Image() ;
                img.src = imgUrl ;
                img.onload = () =>
                {
                    setImageLoaded(prev => 
                        {
                            const loaded = prev + 1; 
                            if( loaded === frames.current.maxIndex )
                            { 
                                console.log("All Images Loaded") ;
                                loadImg(frames.current.currentIndex) ;
                                startAnimation() ;
                            }

                            return loaded ;
                        }) ;
                    }
                    arr.push(img) ;
            }
            imgArr.current = arr ; 
            
        }

    const loadImg = (index) => 
    {
        if (index >= 0 && index <= frames.current.maxIndex)
        {
            const img = imgArr.current[index] ;
            const canvas = canvasRef.current ;
            const ctx = canvas.getContext("2d") ;
            canvas.width = window.innerWidth ;
            canvas.height = window.innerHeight ;

            const scaleX = canvas.width/img.width ;
            const scaleY = canvas.height/img.height ;
            const scale = Math.max(scaleX , scaleY) ;

            const newWidth = img.width * scale ;
            const newHeight = img.height * scale ;

            const offsetX = [canvas.width - newWidth] / 2 ;
            const offsetY = [canvas.height - newHeight] / 2 ;

            ctx.clearRect(0,0 , canvas.width , canvas.height) ;
            ctx.imageSmoothingEnabled = true ;
            ctx.imageSmoothingQuality = "high" ;
            ctx.drawImage(img , offsetX , offsetY , newWidth , newHeight ) ; 
            frames.current.currentIndex = index ;

        }
    }

    const startAnimation = () => 
    {
        
        let tl = gsap.timeline(
            {
                scrollTrigger:{
                    trigger:".parentCanvas",
                    start:"top top",
                    
                    scrub:2 ,

                }
            }
        ) ;
        tl.to(frames.current , {
                currentIndex : frames.current.maxIndex ,
                onUpdate : () => 
                {
                    loadImg( Math.floor(frames.current.currentIndex)  )
                }
            })

    }

        useEffect( () =>
        {
            preloadImages() ;
        } , [] )



  return (
    <div className='parentCanvas relative top-0 left-0 w-full h-[700vh]  bg-cyan-500'>
      <div className='sticky top-0 left-0  w-full h-screen'>
            <canvas ref={canvasRef} className='myFrame w-full h-screen'>

            </canvas>
      </div>
    </div>
  )
}

export default Canvas

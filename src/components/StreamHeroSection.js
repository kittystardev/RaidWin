import { Box } from '@mui/material'
import React from 'react'
import stream_hero from '../assets/images/stream_hero.png'
import streammobile from '../assets/images/streammobile.png'

export default function StreamHeroSection() {
    return (
        <div className='mb-8 -mt-8 sm:-mt-8 md:-mt-8 lg:mt-0'>
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' }, backgroundColor: '#1C2438', borderRadius: '24px', minHeight: '224px', color: '#D6DCEC', position: 'relative', alignItems: 'center', overflow: 'hidden' }}>
                <div className='block sm:block md:block lg:flex justify-between h-full relative w-1/2'>
                    <div className='h-full flex'>
                        <div className='pl-8 flex items-center'>
                            <div className=''>
                                <div className='font-extrabold text-[56px] tracking-tight leading-[64px] text-gray capitalize'>
                                    Streams
                                </div>
                                <div className='mt-1 font-black text-sm leading-6 tracking-wider text-space-gray uppercase'>
                                    PLAY WITH THEM TO WIN OTHER NFTS
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className=''>
                    <img src={stream_hero} className='absolute  right-[-119px] md:top-[-110px] lg:top-[-195px] bg-center' />
                </div>
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none', lg: 'none' }, borderRadius: '24px' }}>
                {/* <div className='font-extrabold text-[36px] tracking-tight leading-[48px] text-gray capitalize text-center mt-8'>
                    Streams
                </div>
                <div className='mt-1 font-black text-sm leading-6 tracking-wider text-space-gray uppercase text-center'>
                    PLAY WITH THEM TO WIN OTHER NFTS
                </div>
                <div className='stream-mobile'>

                </div> */}
                <div className='stream-mobile'>
                        <div className='font-extrabold text-[36px] tracking-tight leading-[48px] text-gray capitalize text-center mt-8'>
                            Streams
                        </div>
                        <div className='mt-1 font-black text-sm leading-6 tracking-wider text-space-gray uppercase text-center'>
                            PLAY WITH THEM TO WIN OTHER NFTS
                        </div>

                    <div className=''>
                        <img src={streammobile} className='mx-auto' />
                    </div>
                </div>
            </Box>
        </div>
    )
}

import { ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/outline'
import styled from 'daisyui/dist/styled';
import React from 'react'
import { useSelector } from 'react-redux';
import revenue_sharing from '../assets/images/revenue_sharing.png'
import solana_icon from '../assets/images/solana_icon.svg'
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";


export default function FirstJoin() {

    const usdtValue = useSelector(state => state.solanaprice.priceUsdt);

    return (
        <>
            <div className='hidden sm:block md:block lg:block'>
                <div className='mt-6 w-full bg-yankees-blue rounded-3xl px-4 py-8 cursor-pointer'>
                    <div className='flex justify-between'>
                        <div className='flex gap-3'>
                            <div>
                                <img src={revenue_sharing} className="w-12 h-12" />
                            </div>
                            <div className='text-space-gray font-semibold text-sm leading-6 tracking-wide flex items-center'>
                                Be the first to join round and get
                            </div>
                            <div className='flex items-center'>
                                <img src={solana_icon} alt='solana' />
                            </div>
                            <div className='flex gap-1 items-center font-bold tracking-wide text-base'>
                                <span className='text-chat-tag  '>
                                    1
                                </span> {"  "}
                                <span className='text-gray'>
                                    ($ {
                                        usdtValue?.data?.priceUsdt
                                    })
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <Tooltip title="Information">
                                <InformationCircleIcon className='h-6 w-6 text-nouveau-main' />
                            </Tooltip>
                        </div>

                    </div>
                </div>
            </div>
            <div className='block sm:hidden md:hidden lg:hidden'>

                <div className='mt-6 w-full bg-yankees-blue rounded-3xl px-4 py-8 cursor-pointer'>
                    <div className='flex gap-3'>
                        <div className='w-14 h-14'>
                            <img src={revenue_sharing} />
                        </div>
                        <div className='text-space-gray font-semibold text-sm leading-6 tracking-wide'>
                            <span className="w-full">
                                Be the first to join round and get
                            </span>
                            <span className="inline-flex items-baseline gap-3">
                                <span className='ml-2 h-[13px]'> <img src={solana_icon} alt='solana' /> </span>
                                <span className='text-chat-tag  '>
                                    1
                                </span> {"  "}
                                <span className='text-gray'>
                                    {" "} ($16.20)
                                </span>
                            </span>
                        </div>
                        <div className='flex items-start -mt-4'>
                            <Tooltip title="Information">
                                <InformationCircleIcon className='h-6 w-6 text-nouveau-main' />
                            </Tooltip>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

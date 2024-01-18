import  { useEffect } from 'react'
import { useState } from 'react';
import { fetchPlayerById } from '../utils/utils';

export default function usePlayer(pubKey) { 

    const [userInfo, setUserInfo] = useState({
        _id: '',
        profileImage: '',
        userName: '',
        email:'',
        websiteLink: '',
        bio: '',
        twitter: '',
        
    }) 
    useEffect(()=>{ 
        if(pubKey && pubKey !== '') {
            (async function(){
                setUserInfo(await fetchPlayerById(pubKey));
            })()
        }
    }, [pubKey])

    return userInfo
}

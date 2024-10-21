import React from 'react'
import ChangePasswordCard from '../components/ChangePasswordCard'
import ProfileCard from '../components/ProfileCard'

const UserProfileCard = () => {
    return (
        <div class="grid grid-cols-12 gap-4 mb-5">
            <div class="col-span-5">
                <ChangePasswordCard />
            </div>
            <div class="col-span-7">
                <ProfileCard/>
            </div>
        </div>

    )
}

export default UserProfileCard
import { User } from '@supabase/supabase-js';
import { User_Relation } from '@/types/databases.types';
import { useEffect, useState } from 'react';
import { getAuthUser, getUserById } from '@/app/conversations/actions';
import clsx from 'clsx';
import Avatar from '@/app/components/Avatar';

interface FriendBoxProps {
    data : User_Relation
    user : User
}

const FriendBox: React.FC<FriendBoxProps> = ({
    data,
    user
  }) => {
    const [otherUser, setOtherUser] = useState(user);

    useEffect(() => {
      const fetchOtherUser = async () => {
        try {
          const dataUser = await getAuthUser();
          let otherU = await getUserById(data.id_other_user);
          console.log('User 2:', otherU);
          if (data.id_user!==dataUser.user?.id) {
            otherU = await getUserById(data.id_user);
          }
          if (otherU) {
            setOtherUser(otherU);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchOtherUser();
    },[otherUser])

    
    const isOwn = user?.id === data.id_user;
    const avatar = clsx(isOwn && 'order-2');
    const body = clsx('flex flex-col gap-2', isOwn && 'items-end');

    return (
      <div className='top-5'>
        <div className={avatar}>
          <Avatar user={otherUser} />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">
              {otherUser.user_pseudo}
            </div>
          </div>
        </div>
      </div>
    );
  }

export default FriendBox;
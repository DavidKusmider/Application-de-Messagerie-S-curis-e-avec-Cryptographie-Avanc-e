import { User } from '@supabase/supabase-js';
import {User_Relation, UserMetadata} from '@/types/databases.types';
import { useEffect, useState } from 'react';
import { getAuthUser, getUserById } from '@/app/conversations/actions';
import clsx from 'clsx';
import Avatar from '@/app/components/Avatar';
import { removeFriend } from '../actions';

interface FriendBoxProps {
    data : User_Relation
    onRemove: (idsRelation: any) => void;
    usersMetadata: UserMetadata[],
    user : User | null,
}

const FriendBox: React.FC<FriendBoxProps> = ({
    data,
    usersMetadata,
    user,
    onRemove
  }) => {
    const [otherUser, setOtherUser] = useState<UserMetadata | null>(null);

    useEffect(() => {
      const fetchOtherUser = () => {
        try {
          /*const dataUser = await getAuthUser();
          let otherU = await getUserById(data.id_other_user);*/
          let otherU = usersMetadata.filter((m) => m.id === data.id_other_user)[0]; //await getUserById(data.id_other_user);
          /*if (data.id_user!==user?.id) {
            otherU = await getUserById(data.id_user);
          }*/
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
    const avatar = clsx(isOwn);
    const body = clsx('flex flex-col gap-2', isOwn && 'items-end');

    const handleRemove = async (id : string) => {
      const data = await removeFriend(id);
      onRemove(data);
    }

    return (
      <div className='top-5 flex justify-between items-center'>
        <div className={avatar}>
          <Avatar user={otherUser} />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">
              {otherUser !== null ? otherUser.user_pseudo : ""}
            </div>
          </div>
        </div>
        <button onClick={() => handleRemove(otherUser.id)}>
          delete
        </button>
      </div>
    );
  }

export default FriendBox;
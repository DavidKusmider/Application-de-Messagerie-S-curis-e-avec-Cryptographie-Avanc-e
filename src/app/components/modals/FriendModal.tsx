'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from 'react-hook-form';

import Select from '../inputs/Select';
import Modal from './Modal';
import Button from '../Button';
import { toast } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';
import { getAllUsers, getUsersByUsername } from '@/app/conversations/actions';
import { addFriend } from '@/app/friends/actions';

interface FriendModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
  onAdd: (idsRelation: any) => void;
}

const FriendModal: React.FC<FriendModalProps> = ({ 
  isOpen, 
  onClose, 
  users = [],
  onAdd
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [usersOtherThanFriends, setUsers] = useState(users);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const idsRelation = await addFriend(data);
      onAdd(idsRelation);
      toast.success('Friend added successfully!');
      router.refresh();
      onClose();
    } catch (error) {
      toast.error('Failed to add friend. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    const fetchOtherUser = async () => {
      const otherUsers = await getAllUsers();
      setUsers(otherUsers);
    };
    fetchOtherUser();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
              >
                Add a new friend
              </h2>
            <div className="mt-10 flex flex-col gap-y-8">
              <Select
                multi={false}
                disabled={isLoading}
                label="New friend user name" 
                options={usersOtherThanFriends.map((user) => ({ 
                  value: user.id,
                  label: user.user_pseudo,
                }))} 
                onChange={(value) => setValue('members', value, { 
                  shouldValidate: true 
                })} 
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={onClose} 
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Add
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default FriendModal;

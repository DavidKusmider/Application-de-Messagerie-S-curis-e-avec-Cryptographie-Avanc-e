'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from "../inputs/Input";
import Modal from './Modal';
import Button from '../Button';
import { toast } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';
import { getAuthUser, getUsersByUsername, createGroup } from '@/app/conversations/actions'; // Importer la fonction pour récupérer les utilisateurs par nom d'utilisateur
import { UserMetadata } from "@/types/databases.types"

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any>([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const groupName = data.name; // Récupérer la valeur du champ "Name" du formulaire
      console.log("data.groupName : ", groupName);
      // Envoyer la requête à la base de données Supabase avec les données du formulaire
      const data2 = await getAuthUser();
      setUser(data2!);
      console.log("user : ", user);

      await createGroup(groupName, users, data2.user);
      // Réinitialiser l'état local et afficher une notification de succès
      setInputValue('');
      toast.success('Group created successfully!');
    } catch (error) {
      // Gérer les erreurs de requête
      console.error('Error creating group:', error);
      toast.error('Failed to create group.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    try {
      // Envoyer une requête pour récupérer les utilisateurs correspondant à la saisie de l'utilisateur
      console.log("je rentre dnas handle input change");
      const results = await getUsersByUsername(e.target.value);
      setSearchResults(results);
      setUsers(results);
      console.log("users : ", users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <Input
                disabled={isLoading}
                label="Search friends"
                id="searchFriends"
                // value={inputValue}
                errors={errors}
                register={register}
                onChange={handleInputChange}
              />
              {searchResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Search results:</h3>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {searchResults.map((user) => (
                      <li key={user.id} className="py-2">
                        <span className="block text-sm font-medium text-gray-900">{user.user_pseudo}</span>
                        <span className="block text-sm text-gray-500">{user.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;


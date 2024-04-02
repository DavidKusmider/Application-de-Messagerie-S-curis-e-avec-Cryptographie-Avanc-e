import React, {useContext, useState} from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from "../inputs/Input";
import Modal from './Modal';
import Button from '../Button';
import { toast } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';
import {
  getAuthUser,
  getUsersByUsername,
  createGroup,
  getUsersMetadata,
  getAllUserGroup, getAllGroups
} from '@/app/conversations/actions'; // Importer la fonction pour récupérer les utilisateurs par nom d'utilisateur
import {Group, User_Group, User_Relation, UserMetadata} from "@/types/databases.types"
import {SocketContext} from "@/app/conversations/socketContext";

interface GroupChatModalProps {
  isOpen?: boolean,
  onClose: () => void,
  currentUser: User | null;
  groups: Group[];
  friends: User_Relation[],
  usersMetadata: UserMetadata[],
  userGroupsData: User_Group[],
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
    currentUser,
    groups,
    friends,
    usersMetadata,
    userGroupsData,
}) => {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserMetadata[]>([]);
  const [user, setUser] = useState<User | null>(currentUser);
  const [users, setUsers] = useState<UserMetadata[]>([]);
  const [userChecked, setUserChecked] = useState<{userId: string[], response: string[]}>(
      {
        userId: [],
        response: [],
      });

  const socket = useContext(SocketContext);
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
      //const data2 = await getAuthUser();
      //setUser(data2!);
      //console.log("user : ", user);

      const usersToAddToGroup : UserMetadata[] = [];
      userChecked.response.forEach((r) => {
        usersMetadata?.forEach((m) => {
          if(m.id === r){
            usersToAddToGroup.push(m);
          }
        });
      });

      await createGroup(groupName, usersToAddToGroup, user);
      const newUserGroup = await getAllUserGroup();
      const newGroups = await getAllGroups();
      socket.emit('save_group', newUserGroup, newGroups);

      // Réinitialiser l'état local et afficher une notification de succès
      toast.success('Group created successfully!');
    } catch (error) {
      // Gérer les erreurs de requête
      console.error('Error creating group:', error);
      toast.error('Failed to create group.');
    } finally {
      setIsLoading(false);
      onClose();
    }
    setUserChecked({userId: [], response: []});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Envoyer une requête pour récupérer les utilisateurs correspondant à la saisie de l'utilisateur
      console.log("je rentre dnas handle input change");
      const results = usersMetadata.filter( m => m.user_pseudo.toLowerCase().includes(e.target.value.toLowerCase()));//await getUsersByUsername(e.target.value);
      setSearchResults(results);
      setUsers(results);
      console.log("users : ", users);

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCheckboxChange = (e:any) => {
    const {value, checked} = e.target;
    const { userId } = userChecked;
    if(checked){
      setUserChecked({
        userId: [...userId, value],
        response: [...userId, value],
      });
    }else{
      setUserChecked({
        userId : userId.filter((e) => e !== value),
        response : userId.filter((e) => e !== value),
      });
    }
  };

  const cancelModal = () => {
    setUserChecked({userId: [], response: []});
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={cancelModal}>
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
                placeholder="Enter the group name"
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
                      <li key={user.id} className="flex items-center py-2">
                        <input
                          className="mr-2 rounded border-gray-300 w-5 h-5 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                          type="checkbox"
                          name="usersChecked"
                          value={user.id}
                          onChange={handleCheckboxChange}
                          checked={userChecked.response.includes(user.id)}
                        />
                        <label className="text-sm font-medium text-gray-900">{user.user_pseudo}</label>
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
            onClick={cancelModal}
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading || userChecked.response.length === 0} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;


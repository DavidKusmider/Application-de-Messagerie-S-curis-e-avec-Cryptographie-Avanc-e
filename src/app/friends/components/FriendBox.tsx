import { User_Relation } from '@/types/databases.types';

interface FriendBoxProps {
    data : User_Relation
}

const FriendBox: React.FC<FriendBoxProps> = ({
    data,
  }) => {
    return (
        <div className='top-5'>
            {data.id_other_user}
        </div>
    );
  }

export default FriendBox;
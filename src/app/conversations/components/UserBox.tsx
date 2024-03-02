import { User } from '@/app/types/index';

interface UserBoxProps {
    data : User
}

const UserBox: React.FC<UserBoxProps> = ({
    data,
  }) => {
    return (
        <div className='top-5'>
            Test
        </div>
    );
  }

export default UserBox;
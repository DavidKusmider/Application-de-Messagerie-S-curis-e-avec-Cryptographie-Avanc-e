import { Group } from '@/app/types/index';

interface GroupBoxProps {
    data : Group
}

const GroupBox: React.FC<GroupBoxProps> = ({
    data,
  }) => {
    return (
        <div className='top-5'>
            Test
        </div>
    );
  }

export default GroupBox;
import { Notification } from '@/app/types/index';

interface NotifBoxProps {
    data : Notification
}

const NotifBox: React.FC<NotifBoxProps> = ({
    data,
  }) => {
    return (
        <div className='top-5'>
            Test
        </div>
    );
  }

export default NotifBox;
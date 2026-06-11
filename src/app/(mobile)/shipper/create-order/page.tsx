import Topbar from '@/components/topbar';
import CreateOrderForm from '../_components/CreateOrderForm';

const CreateOrderPage = () => {
    return (
        <>
            <Topbar backHref="/shipper">Создать заявку</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <CreateOrderForm />
            </div>
        </>
    );
};

export default CreateOrderPage;

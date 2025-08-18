'use client';
import { useAppContext } from '@/context/AppContext';
import Loading from './Loading';

const MainLayout = ({ children }) => {
	const { loading } = useAppContext();
	return <>{loading ? <Loading /> : children}</>;
};

export default MainLayout;

import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;

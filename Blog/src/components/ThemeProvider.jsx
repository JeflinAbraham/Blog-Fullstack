import { useSelector } from 'react-redux';
export default function ThemeProvider({ children }) {
    const { theme } = useSelector((state) => state.theme);
    return (
        <div className={theme}>
            {/* 
            if the outer div(parent div) has a dark theme, the innner div uses the classes provided with a dark: variant.
            */}
            <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
                {children}
            </div>
        </div>
    );
}
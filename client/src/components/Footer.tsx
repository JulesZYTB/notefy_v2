export default function Footer() {
    return (
        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-md">
            &copy; {new Date().getFullYear()} Notefy. Tous droits réservés.
        </footer>
    );
}
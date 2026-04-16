function Footer() {
  return (
    <footer className="py-8 border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 text-white text-center">
        <p className="text-sm text-white font-medium">
          © 2026 RBT INTERN GROUP 3 — The Premier Event Management Platform
        </p>
        <p className="text-sm text-white mt-2">
          Developed by{" "}
          <a href="https://github.com/creishen" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
            Creishen
          </a>
          {" • "}
          <a href="https://github.com/KyleBorja/KyleBorja" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
            Kyle
          </a>
          {" • "}
          <a href="https://github.com/krankwa" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
            Kent
          </a>
          {" • "}
          <a href="https://github.com/keken2021" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
            Kurt
          </a>
        </p>
      </div>
    </footer>
  );
}
export default Footer;

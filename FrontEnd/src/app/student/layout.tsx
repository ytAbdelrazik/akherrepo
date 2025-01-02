export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <header>
          <h1>Student Section</h1>
        </header>
        <main>{children}</main>
      </div>
    );
  }
  
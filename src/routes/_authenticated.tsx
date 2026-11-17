import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/clerk-react";

import { MovieDialogProvider } from "@/components/site/movie-dialog";
import { SearchProvider } from "@/components/site/search";
import { Footer, MobileTabs, Navbar } from "@/components/site/chrome";
import { Landing } from "@/components/site/landing";

/** Every page lives under this layout, so every page needs a signed-in user. */
export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <>
      <ClerkLoading>
        <div className="grid min-h-dvh place-items-center">
          <div className="beam" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <Landing />
        </SignedOut>
        <SignedIn>
          <MovieDialogProvider>
            <SearchProvider>
              <Navbar />
              <main>
                <Outlet />
              </main>
              <Footer />
              <MobileTabs />
            </SearchProvider>
          </MovieDialogProvider>
        </SignedIn>
      </ClerkLoaded>
    </>
  );
}

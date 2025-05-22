
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Players from "./pages/Players";
import PlayerProfile from "./pages/PlayerProfile";
import Locations from "./pages/Locations";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/players" element={<Layout><Players /></Layout>} />
          <Route path="/players/:id" element={<Layout><PlayerProfile /></Layout>} />
          <Route path="/locations" element={<Layout><Locations /></Layout>} />
          <Route path="/games" element={<Layout><Games /></Layout>} />
          <Route path="/games/:id" element={<Layout><GameDetails /></Layout>} />
          <Route path="/tournaments" element={<Layout><Tournaments /></Layout>} />
          <Route path="/tournaments/:id" element={<Layout><TournamentDetails /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

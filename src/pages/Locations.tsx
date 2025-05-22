
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Search, CalendarRange, MapPin } from 'lucide-react';
import { Location, Schedule } from '../types/models';
import { format } from 'date-fns';

// Mock data
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Office - 3rd Floor',
    description: 'Near the kitchen area',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    name: 'Break Room',
    description: 'Adjacent to meeting room B',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    name: 'Game Room',
    description: 'Dedicated space for games and recreation',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// Generate dates for this week
const today = new Date();
const thisWeek = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(today.getDate() - today.getDay() + i);
  return format(date, 'yyyy-MM-dd');
});

const mockSchedules: Schedule[] = [
  {
    id: '1',
    locationId: '1',
    scheduledDate: thisWeek[1],
    startTime: '12:00',
    endTime: '13:00'
  },
  {
    id: '2',
    locationId: '1',
    scheduledDate: thisWeek[3],
    startTime: '16:00',
    endTime: '17:00'
  },
  {
    id: '3',
    locationId: '2',
    scheduledDate: thisWeek[2],
    startTime: '15:00',
    endTime: '16:00'
  }
];

const LocationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (location.description && location.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Function to get schedules for a specific location
  const getLocationSchedules = (locationId: string) => {
    return schedules.filter(schedule => schedule.locationId === locationId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Link to="/locations/new">
          <Button className="bg-tableblue hover:bg-blue-600 text-white">
            <Plus className="mr-1 h-4 w-4" />
            Add Location
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="list">Location List</TabsTrigger>
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map(location => {
                const locationSchedules = getLocationSchedules(location.id);
                
                return (
                  <Card key={location.id} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{location.name}</CardTitle>
                          {location.description && (
                            <CardDescription className="mt-1">{location.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <div className="text-sm font-medium mb-2">Upcoming Bookings</div>
                      {locationSchedules.length > 0 ? (
                        <ul className="space-y-2">
                          {locationSchedules.map(schedule => (
                            <li key={schedule.id} className="flex items-center gap-2 text-sm">
                              <CalendarRange className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(new Date(schedule.scheduledDate), 'E, MMM d')} • {schedule.startTime} - {schedule.endTime}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No upcoming bookings</p>
                      )}
                    </CardContent>
                    
                    <CardFooter className="border-t p-4 flex justify-between">
                      <Link 
                        to={`/locations/${location.id}`}
                        className="text-sm text-tableblue hover:underline"
                      >
                        View Details
                      </Link>
                      <Link to={`/locations/${location.id}/schedule`}>
                        <Button variant="outline" size="sm">
                          Book Table
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No locations found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Book a table for your match</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-2">
                  <div className="font-medium">Location</div>
                  {thisWeek.map((date, i) => (
                    <div key={date} className="text-center font-medium text-sm">
                      <div>{format(new Date(date), 'E')}</div>
                      <div className="text-muted-foreground">{format(new Date(date), 'MMM d')}</div>
                    </div>
                  ))}
                </div>
                
                {locations.map(location => (
                  <div key={location.id} className="grid grid-cols-8 gap-2 py-3 border-t">
                    <div className="flex items-center">{location.name}</div>
                    
                    {thisWeek.map(date => {
                      const daySchedules = schedules.filter(s => 
                        s.locationId === location.id && s.scheduledDate === date
                      );
                      
                      return (
                        <div key={date} className="min-h-[80px] rounded border border-dashed border-muted p-1">
                          {daySchedules.length > 0 ? (
                            <div className="h-full">
                              {daySchedules.map(schedule => (
                                <div 
                                  key={schedule.id} 
                                  className="text-xs p-1 mb-1 bg-primary/10 text-primary rounded"
                                >
                                  {schedule.startTime} - {schedule.endTime}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <Link to={`/locations/${location.id}/schedule?date=${date}`}>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationsPage;

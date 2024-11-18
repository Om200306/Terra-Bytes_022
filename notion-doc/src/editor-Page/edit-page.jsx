import { useState } from 'react';
import { useConvexAuth, useMutation } from 'convex/react';
import { Heading } from '@/components/heading';
import { Navigation } from './navigaton';
import photo from "../assets/empty.svg"
import { useUser } from '@clerk/clerk-react';
import { PlusCircle } from 'lucide-react';
import {Button} from "@/components/ui/button"
import { toast } from 'sonner';
import { api } from '/convex/_generated/api';



export const EditPage = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [editorContent, setEditorContent] = useState('');

  const { user } = useUser();
 
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled"});

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create new note."
    });
   
  };

  return (
    <div className='h-full flex  dark:bg-[#1f1f1f]'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>
        <div style={{height:"100vh"}} className='flex flex-col items-center justify-center space-y-4'>
        <img src={photo} alt="image"  height="300" width="300"/>

       <h2 className='text-lg font-medium'>Welcome to {user?.firstName}&apos;s Notion</h2>
       
       <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2"/>
        Create a note
       </Button>

        </div>
        
      </main>
    </div>
  );
};

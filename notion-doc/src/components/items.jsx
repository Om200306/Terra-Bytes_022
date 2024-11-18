import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Skeleton } from "./ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

export function Item({label , icon :Icon , onClick=null,id=0,active=false ,documentIcon,
    isSearch=false, level=0, onExpand , exPanded=false
}) {
    
    const {user}=useUser();
    const router = useNavigate();
    const create =useMutation(api.documents.create);
    const archive=useMutation(api.documents.archive);


    const onArchive = (event) => {
        event.stopPropagation();
        if (!id) return;
        
        const promise = archive({ id })
          .then(() => router.push('/documents'));
      
        toast.promise(promise, {
          loading: "Moving to trash...",
          success: "Note moved to trash!",
          error: "Failed to archive note"
        });
      };
      

    
    const handleExpand = (event) => {
        event.stopPropagation();
        onExpand?.();
      };

      const onCreate = (event) => {
        event.stopPropagation();
        if (!id) return;
      
        const promise = create({ title: "Untitled", parentDocument: id })
          .then((documentId) => {
            if (!exPanded) {
              onExpand?.();
            }
            //router(`/documents/${documentId}`);
          });
      
        toast.promise(promise, {
          loading: "Creating a new note...",
          success: "New note created!",
          error: "Failed to create a new note",
        });
      };
      
      

    const ChevronIcon = exPanded ? ChevronDown : ChevronRight;
    

    return(
        <div onClick={onClick}
        role="button"
        style={{paddingLeft : level ? `${(level*12)+25}px`:"25px"}}
        className={(`group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium, ${active}&&"bg-primary/5 text-primary-foreground"`)}
        >

            { !!id &&(
                <div
                className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                onClick={handleExpand}>
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50"/>
                </div>
            )}

            {documentIcon ? (
                <div>
                    {documentIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground"/>
            )}

            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none
                    items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">
                        &#9784;
                    </span>
                </kbd>
            )}
            
                {!!id && (
                    <div className="ml-auto flex items-center gap-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
                          hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
                          <DropdownMenuItem onClick={onArchive}>
                            <Trash className="w-4 h-4 mr-2"/>
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <div className="text-xs text-muted-foreground p-2">
                            Last edited by: {user?.fullName}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                      role="button" onClick={onCreate}>
                        <Plus className="w-4 h-4 text-muted-foreground"/>
                      </div>
                    </div>
                  )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }) {
    return (
      <div style={{ paddingLeft: level ? `${(level * 12) + 25}px` : '25px' }} className="flex gap-x-2 py-[3px]">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[30%]" />
      </div>
    );
  };
  

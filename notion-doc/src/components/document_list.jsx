import { useQuery } from "convex/react";
import { api } from "/convex/_generated/api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Item } from "./items";
import { FileIcon } from "lucide-react";


export function DocumentList({ parentDocumentId, level = 0 }){

    const params = useParams();

    const [expanded, setExpanded] = useState({});

    const onExpand = (documentId) => {
        setExpanded((prevExpanded) => ({
          ...prevExpanded,
          [documentId]: !prevExpanded[documentId],
        }));
      };

      const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId,
      });

      if (documents === undefined) {
        return (
          <>
            <Item.Skeleton level={level} />
            {level === 0 && (
              <>
                <Item.Skeleton level={level} />
                <Item.Skeleton level={level} />
              </>
            )}
          </>
        );
      }
    

    return(
        <>
        <p
        className={(
          `hidden text-sm font-medium text-muted-foreground/80`,
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
      >
        No pages available
      </p>

      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
        
        </>
    )
}
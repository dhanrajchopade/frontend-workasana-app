import { createContext,useContext,useState } from "react";
import useFetch from "../useFetch";

const SearchContext = createContext()

export const SearchProvider = ({children}) =>{
    const [searchTerm, setSearchTerm] = useState("")
    const {data,loading, error} = useFetch("https://carbon-taskmanager-backend.vercel.app/projects")

const filterData = data.project.filter((project)=>project.name.toLowerCase().includes(searchTerm.toLowerCase()))

return(
    <SearchContext.Provider value={{
        searchTerm, setSearchTerm, filterData,data,loading,error,
    }}
    >
        {children}
        </SearchContext.Provider>
)

}

export const useSearch =()=>{
    return useContext(SearchContext)
}
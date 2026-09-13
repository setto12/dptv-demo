export default function Loading() {
return ( <div className="flex min-h-screen items-center justify-center bg-gray-100"> <div className="flex items-center gap-2 text-sm text-gray-500"> <span
       className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
       aria-hidden="true"
     />


    <span>Loading...</span>
  </div>
</div>


);
}

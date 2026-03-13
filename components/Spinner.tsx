import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export const ButtonSpinner = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex items-center gap-2'>
      <Loader2 className="text-primary-foreground size-3 animate-spin" /> {children}
    </div>
  )
}


export const Spinner = () => {
  return (
    <Loader2 className="text-muted-foreground size-4 animate-spin" />
  )
}


export const LineSpinner = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex items-center gap-2 text-muted-foreground text-sm '>
      <Loader2 className="size-3 inline-block animate-spin" /> {children}
    </div>
  )
}
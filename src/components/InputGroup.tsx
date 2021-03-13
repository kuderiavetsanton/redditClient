import classNames from 'classnames'

interface InputGroupProps{
    type:string,
    value:string,
    error:string,
    setValue:(arg: string) => void,
    name:string
}

const inputGroupStyles = "w-full p-3 pt-4 placeholder-transparent border border-gray-300 rounded outline-none bg-gray-50 animatedInput hover:bg-white focus:bg-white"
let InputGroup:React.FC<InputGroupProps> = ({ type, value, error ,setValue, name}) => {
    return (
        <div className="relative mt-4">
            <input type={type} placeholder="Username" className={ classNames(inputGroupStyles,{ 'border-red-500':error}) } onChange={e => setValue(e.target.value)}/>
            <label htmlFor="" className={classNames("absolute text-gray-400 capitalize top-3 left-2 animatedLabel",{'valued':value})}>{ name }</label><br/>
            <small className="text-red-500">{error}</small>
        </div>
    )
}
export default  InputGroup

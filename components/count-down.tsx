"use client"
import {useState,useRef ,useEffect,ChangeEvent} from "react"
import {Input} from "./ui/input"
import { Button } from "./ui/button"

export default function Countdown(){
    // state to manage the duration input
    const [duration, setDuration] = useState<number|string>("")
    // state to manage the countdown timer value
    const  [timeLeft, setTimeLeft]=useState<number>(0)
    // state to track if the timer is active
    const [isActive,setIsActive] = useState<boolean>(false)
    // state to track if the time is paused
    const [isPaused,setIsPaused] = useState<boolean>(false)
    // reference to store the timer id
    const timerRef = useRef<NodeJS.Timeout|null>(null)

    // function to handle setting the duration of the countdown
    const handleSetDuration=():void=>{
        if(typeof duration ==="number" && duration >0){
            setTimeLeft(duration) //set the countdown timer
            setIsActive(false) // reset active state
            setIsPaused(false) // reset paused state
            // clear any existing timer
            if(timerRef.current){
                clearInterval(timerRef.current)
            }

        }
    }
    // function to start the countdown timer
    const handleStart=():void=>{
        if(timeLeft>0){
            setIsActive(true) // set the timer is active
            setIsPaused(false) //unpaused the time if it was paused
        }
    }
    // function is paused the countdown timer
    const handlePaused=():void=>{
        if(isActive){
            setIsPaused(true) // set the timer is paused
            setIsActive(false) // set the timer as inactive
            // clear any existing timer
            if(timerRef.current){
                clearInterval(timerRef.current)
            } 
        }
    }
    // function to reset the countdown timer
    const handleReset=():void=>{
        setIsActive(false) // set the timer as inactive
        setIsPaused(false) // set the timer as not paused
        setTimeLeft(typeof duration ==="number"?duration:0) // reset the timer
        // clear existing timer
        if(timerRef.current){
            clearInterval(timerRef.current)

        }
    }
    // use hook to manage the countdown interval
    useEffect(()=>{
        // if the timer is active and not paused 
        if(isActive && !isPaused){
            //set an interval to decrease the time left 
            timerRef.current= setInterval(()=>{
                setTimeLeft((prevTime)=>{
                    // if time is up clear the interval
                    if(prevTime<=1){
                     clearInterval(timerRef.current!)
                     return 0
                    }
                    // decrease the time left by one second 
                    return prevTime - 1
                })
            },1000)  // interval of 1 second 
        }
        // clean up function to clkear the interval
        return ()=>{
            if(timerRef.current){
                clearInterval(timerRef.current)
            }
        }
    },[isActive, isPaused]) // dependencies array to rerun the effect 

//  function to format the time left into mm:ssformat
const formatTime=(time:number):string=>{
    const minute = Math.floor(time/60) // calculate minutes
    const seconds = time%60 // calculate seconds
    // return the formated string
    return `${String(minute).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`
}
//  function to handle changes in the duration input field 
    const handleDurationChange = (e:ChangeEvent<HTMLInputElement>):void=>{
    setDuration(Number(e.target.value)||"") // update the duration state
}
// tsx return statement countdown UI
return (
    // container div for centering the content
    <div className="flex felx-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        {/* timer box container */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md ">
            {/* title of the countdown timer */}
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">Countdown Timer</h1>
            {/* input and set button duration */}
            <div className="flex  items-center mb-6 ">
                <Input 
                type="number"
                id="duration"
                placeholder="Enter duration in seconds "
                value={duration}
                onChange={handleDurationChange}
                className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600  dark:bg-gray-700 dark:text-gray-200"/>
              <Button 
              onClick={handleSetDuration}
              variant="outline"
              className="text-gray-800 dark:text-gray-200"
              >
                Set

              </Button>
            </div>
            {/* diplay the format time left */}
            <div className="text-6xl font-bold text-gray-600 dark:text-gray-200 mb-8 text-center">
             {formatTime(timeLeft)}
            </div>
            {/* buttons to start pause and reset  */}
            <div className="flex justify-center gap-4">
                <Button 
                onClick={handleStart}
                variant="outline"
                className="text-gray-800 dark:text-gray-200"
                >
                    {isPaused?"Resume":"Start"}

                </Button>
                <Button
                onClick={handlePaused}
                variant="outline"
                className="text-gray-800 dark:text-gray-200"
                >
               Pause
                </Button>
                <Button
                onClick={handleReset}
                variant="outline"
                className="text-gray-800 dark:text-gray-200"
                >
                    Reset

                </Button>

            </div>


        </div>

    </div>
)
}
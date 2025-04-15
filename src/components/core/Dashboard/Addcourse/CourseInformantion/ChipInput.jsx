import { useEffect, useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

export default function ChipInput({
    label,
    name,
    placeholder,
    register = () => { },  // Ensure register is always defined
    errors = {},
    setValue = () => { },  // Ensure setValue is always defined
}) {
    const { editCourse, course } = useSelector((state) => state.course);
    const [chips, setChips] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editCourse && course?.tags) {
            setChips(Array.isArray(course.tags) ? course.tags : []);
        }
        register(name, {
            required: "This field is required",
            validate: (value) => Array.isArray(value) && value.length > 0,
        });
    }, [editCourse, course, name, register]);

    useEffect(() => {
        setValue(name, chips);
    }, [chips, name, setValue]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const newChip = event.target.value.trim();
            if (newChip && !chips.includes(newChip)) {
                setChips((prev) => [...prev, newChip]);
                if (inputRef.current) inputRef.current.value = "";
            }
        }
    };

    const handleDeleteChip = (index) => {
        setChips((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>
            <div className="flex flex-wrap w-full gap-y-2">
                {chips.map((chip, index) => (
                    <div
                        key={index}
                        className="flex items-center px-2 py-1 m-1 text-sm bg-yellow-400 rounded-full text-richblack-5"
                    >
                        {chip}
                        <button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => handleDeleteChip(index)}
                        >
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ))}
                <input
                    id={name}
                    name={name}
                    type="text"
                    ref={inputRef}
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="w-full form-style"
                />
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {errors[name]?.message || `${label} is required`}
                </span>
            )}
        </div>
    );
}

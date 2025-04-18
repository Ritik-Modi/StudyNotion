import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RequirementsField({
    name,
    label,
    register,
    setValue,
    errors,
    getValues,
}) {
    const { editCourse, course } = useSelector((state) => state.course);
    const [requirement, setRequirement] = useState("");
    const [requirementsList, setRequirementsList] = useState([]);

    useEffect(() => {
        if (editCourse && course?.instructions) {
            setRequirementsList(course.instructions || []);
        }
        register(name, { required: true, validate: (value) => value.length > 0 });
    }, [editCourse, course, register, name]);

    useEffect(() => {
        setValue(name, requirementsList);
    }, [requirementsList, setValue, name]);

    const handleAddRequirement = () => {
        if (requirement.trim()) {
            setRequirementsList([...requirementsList, requirement.trim()]);
            setRequirement("");
        }
    };

    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementsList];
        updatedRequirements.splice(index, 1);
        setRequirementsList(updatedRequirements);
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>
            <div className="flex flex-col items-start space-y-2">
                <input
                    type="text"
                    id={name}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full form-style"
                />
                <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="font-semibold text-yellow-50"
                >
                    Add
                </button>
            </div>
            {requirementsList.length > 0 && (
                <ul className="mt-2 list-disc list-inside">
                    {requirementsList.map((req, index) => (
                        <li key={index} className="flex items-center text-richblack-5">
                            <span>{req}</span>
                            <button
                                type="button"
                                className="ml-2 text-xs text-pure-greys-300"
                                onClick={() => handleRemoveRequirement(index)}
                            >
                                Clear
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    );
}

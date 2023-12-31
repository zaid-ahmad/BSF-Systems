"use server";

import { revalidatePath } from "next/cache";
import { Admin, Course } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export const addAdmin = async (formData) => {
    const { username, password } = Object.fromEntries(formData);

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Admin({
            username,
            password: hashedPassword,
        });

        await newUser.save();
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create admin!");
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
};

export const updateAdmin = async (formData) => {
    const { id, username, password } = Object.fromEntries(formData);

    try {
        connectToDB();

        const updateFields = {
            username,
            password,
        };

        Object.keys(updateFields).forEach(
            (key) =>
                (updateFields[key] === "" || undefined) &&
                delete updateFields[key]
        );

        await Admin.findByIdAndUpdate(id, updateFields);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to update user!");
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
};

export const addCourse = async (formData) => {
    /*
        Get object id of that category
        get stringified version of image
    */
    const { name, category, image, price, description, features, prequisites } =
        Object.fromEntries(formData);

    try {
        connectToDB();

        const newCourse = new Course({
            name,
            category,
            image,
            description,
            features,
            prequisites,
            price,
        });

        await newCourse.save();
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create course!");
    }

    revalidatePath("/dashboard/courses");
    redirect("/dashboard/courses");
};

export const updateProduct = async (formData) => {
    const { id, name, image, description, features, prequisites, price } =
        Object.fromEntries(formData);

    try {
        connectToDB();

        const updateFields = new Course({
            name,
            image,
            description,
            features,
            prequisites,
            price,
        });

        Object.keys(updateFields).forEach(
            (key) =>
                (updateFields[key] === "" || undefined) &&
                delete updateFields[key]
        );

        await Course.findByIdAndUpdate(id, updateFields);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to update course!");
    }

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
};

export const deleteAdmin = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDB();
        await Admin.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to delete admin!");
    }

    revalidatePath("/dashboard/products");
};

export const deleteCourse = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDB();
        await Course.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to delete course!");
    }

    revalidatePath("/dashboard/products");
};

export const authenticate = async (prevState, formData) => {
    const { username, password } = Object.fromEntries(formData);

    connectToDB();

    try {
        await signIn("credentials", { username, password });
    } catch (err) {
        return "Wrong Credentials!";
    }
};

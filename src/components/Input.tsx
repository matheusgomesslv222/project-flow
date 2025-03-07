import { TextInput , TextInputProps } from "react-native";

export function Input({ ...rest}: TextInputProps) {
    return <TextInput
    style={{
        height: 40,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16,
    }}
    {...rest} 
    />
}
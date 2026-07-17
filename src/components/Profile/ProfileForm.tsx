"use client";

import { Button } from "@/components/shadcnui/button";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { profileFormSchema, type ProfileFormType } from "@/lib/zodSchema";
import { updateProfile } from "@/server/updateProfile";
import { uploadAvatar } from "@/server/uploadAvatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagesIcon, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useFilePicker } from "use-file-picker";
import { FileSizeValidator } from "use-file-picker/validators";

interface ProfileFormProps {
  defaultValues: {
    name: string;
    image: string;
  };
}

const ProfileForm = ({ defaultValues }: ProfileFormProps) => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(defaultValues.image);

  const { openFilePicker, filesContent, plainFiles, clear, errors } =
    useFilePicker({
      readAs: "DataURL",
      accept: "image/*",
      multiple: false,
      validators: [new FileSizeValidator({ maxFileSize: 5 * 1024 * 1024 })],
    });

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async () => {
    if (!plainFiles[0]) return;
    setIsUploading(true);
    const { isSuccess, message } = await uploadAvatar(plainFiles[0]);
    if (isSuccess) {
      setCurrentImage(filesContent[0].content as string);
      clear();
      toast.success(message);
      router.refresh();
    } else {
      toast.error(message);
    }
    setIsUploading(false);
  }, [plainFiles, filesContent, clear, router]);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: defaultValues.name },
    mode: "all",
  });

  const onSubmit = async (data: ProfileFormType) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid place-items-center gap-3">
        {filesContent[0] ?
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={filesContent[0].content as string}
            alt="Preview"
            className="size-20 rounded-full object-cover"
          />
        : currentImage ?
          <Image
            src={currentImage}
            alt="Avatar"
            width={256}
            height={256}
            className="size-20 rounded-full object-cover"
            unoptimized
          />
        : <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-full text-2xl font-semibold">
            {defaultValues.name.charAt(0).toUpperCase()}
          </div>
        }

        {errors[0] && (
          <div className="text-destructive text-sm">
            File is too large (max 5 MB)
          </div>
        )}

        <div
          className={`grid ${filesContent[0] ? "grid-cols-2" : "grid-cols-1"} w-full gap-2`}>
          <Button
            type="button"
            variant="outline"
            onClick={() => openFilePicker()}>
            <ImagesIcon />
            {filesContent[0] ? "Change" : "Choose Image"}
          </Button>

          {filesContent[0] && (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}>
              {isUploading ?
                <>
                  <Loader2 className="animate-spin" />
                  Uploading...
                </>
              : <>
                  <Upload />
                  Upload
                </>
              }
            </Button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full">
          {isSubmitting ?
            <>
              <Loader2 className="animate-spin" />
              Saving…
            </>
          : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;

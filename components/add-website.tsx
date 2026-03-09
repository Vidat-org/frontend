"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/orpc"
import { useForm } from "@tanstack/react-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { createWebsiteSchema, intervals } from "@/lib/schemas/website"
import { Spinner } from "./ui/spinner"
import { useState } from "react"
import { getQueryClient } from "@/lib/query-client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddWebsite() {
  const { mutateAsync } = useMutation({
    mutationFn: async ({ url, interval }: { url: string; interval: any }) =>
      await client.createWebsite({ url, interval }),
  })

  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm({
    validators: {
      onSubmit: createWebsiteSchema,
    },
    defaultValues: {
      url: "",
      interval: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync(value)

        getQueryClient().invalidateQueries({ queryKey: ["websites"] })
        toast.success("Hemsidan har lagts till")
        formApi.reset()
        setIsFormOpen(false)
      } catch (err) {
        toast.error("Något gick fel. Försök igen.")
      }
    },
  })

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Lägg till hemsida
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lägg till en hemsida</DialogTitle>
          <DialogDescription>
            Ange webbadressen till den hemsida du vill övervaka.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-website-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Webbadress</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="url"
                      aria-invalid={isInvalid}
                      placeholder="https://exempel.se"
                      autoComplete="off"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="interval"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Intervall</FieldLabel>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Intervall för kontroll" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {intervals.map((interval) => (
                            <SelectItem key={interval} value={interval}>
                              {interval}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <div className="flex justify-end">
            <Button disabled={form.state.isSubmitting}>
              {form.state.isSubmitting && <Spinner />}
              Lägg till hemsida
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

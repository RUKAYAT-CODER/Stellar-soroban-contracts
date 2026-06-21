'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { FormWrapper } from '@/components/form/FormWrapper'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { SignInSchema, type SignInDto } from '@/lib/validations/auth'

const DEFAULT_VALUES: SignInDto = { email: '', password: '' }

export default function SignInPage() {
  const router = useRouter()

  async function handleSignIn(data: SignInDto) {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = (await res.json()) as { message?: string }
      toast.error(body?.message ?? 'Sign-in failed. Please try again.')
      return
    }

    toast.success('Signed in successfully!')
    router.push('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and password to continue.
          </p>
        </div>

        <FormWrapper
          schema={SignInSchema}
          defaultValues={DEFAULT_VALUES}
          onSubmit={handleSignIn}
          className="space-y-4"
        >
          {({ formState: { isSubmitting, isValid } }) => (
            <>
              <FormInput<SignInDto>
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                description="The email you registered with."
              />

              <FormInput<SignInDto>
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="size-4" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </>
          )}
        </FormWrapper>
      </div>
    </main>
  )
}

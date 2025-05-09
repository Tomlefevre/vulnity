"use server"

import crypto from "crypto"

// Mock wordlist check - in production, you'd use a real wordlist or API
const MOCK_WORDLIST = new Set(["password", "123456", "qwerty", "admin"])

// Function to generate a secure password
export async function generatePassword() {
  try {
    // Step 1: Generate a password with 25 characters
    const password = await generateSecurePassword(25)

    // Step 2: Check against wordlist
    await checkAgainstWordlist(password)

    // Step 3: Add salting for uniqueness
    const saltedPassword = addSalting(password)

    // Step 4: Calculate entropy bits
    const bits = calculateEntropyBits(saltedPassword)

    // Step 5: Simulate crack time
    const crackTime = simulateCrackTime(bits)

    // Step 6: Simulate cracking attempt
    const isCrackable = simulateCrackingAttempt(saltedPassword)

    // If the password is crackable, generate a new one recursively
    if (isCrackable) {
      return generatePassword()
    }

    return {
      password: saltedPassword,
      bits,
      crackTime,
    }
  } catch (error) {
    console.error("Error generating password:", error)
    throw new Error("Failed to generate password")
  }
}

// Generate a secure password with special chars, uppercase, and foreign characters
async function generateSecurePassword(length) {
  // Character sets
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const numberChars = "0123456789"
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const foreignChars = "áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ"

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars + foreignChars

  // Generate random bytes
  let randomBytesBuffer = crypto.randomBytes(length * 2) // Get more bytes than needed

  let password = ""
  let index = 0

  // Ensure at least one character from each set
  password += uppercaseChars.charAt(randomBytesBuffer[index++] % uppercaseChars.length)
  password += lowercaseChars.charAt(randomBytesBuffer[index++] % lowercaseChars.length)
  password += numberChars.charAt(randomBytesBuffer[index++] % numberChars.length)
  password += specialChars.charAt(randomBytesBuffer[index++] % specialChars.length)
  password += foreignChars.charAt(randomBytesBuffer[index++] % foreignChars.length)

  // Fill the rest with random characters
  while (password.length < length) {
    if (index >= randomBytesBuffer.length) {
      // If we run out of random bytes, generate more
      const moreBytes = crypto.randomBytes(length)
      randomBytesBuffer = Buffer.concat([randomBytesBuffer.slice(index), moreBytes])
      index = 0
    }

    password += allChars.charAt(randomBytesBuffer[index++] % allChars.length)
  }

  // Shuffle the password
  return shuffleString(password)
}

// Shuffle a string
function shuffleString(str) {
  const array = str.split("")
  for (let i = array.length - 1; i > 0; i--) {
    // Replace crypto.randomInt with a compatible alternative
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join("")
}

// Check if password exists in common wordlists
async function checkAgainstWordlist(password) {
  // In a real implementation, you would check against actual wordlists
  // For this example, we'll use a mock wordlist

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if the password is in our mock wordlist
  if (MOCK_WORDLIST.has(password.toLowerCase())) {
    throw new Error("Password found in common wordlist")
  }

  return true
}

// Add salting to ensure uniqueness
function addSalting(password) {
  // Create a unique salt based on current time and a random value
  const timestamp = Date.now().toString(36)
  const randomSalt = crypto.randomBytes(8).toString("hex")

  // In a real implementation, you might include user-specific data
  // For this example, we'll just use time and random data

  // Add the salt to the password (in a real implementation, you'd store the salt separately)
  // Here we'll just add a few characters from the salt to the password
  const saltChars = (timestamp + randomSalt).substring(0, 5)

  // Insert salt characters at random positions in the password
  let saltedPassword = password
  for (let i = 0; i < saltChars.length; i++) {
    // Replace crypto.randomInt with a compatible alternative
    const position = Math.floor(Math.random() * saltedPassword.length)
    saltedPassword = saltedPassword.substring(0, position) + saltChars[i] + saltedPassword.substring(position)
  }

  // Ensure we still have exactly 25 characters
  return saltedPassword.substring(0, 25)
}

// Calculate entropy bits
function calculateEntropyBits(password) {
  // Count the different character sets used
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  // Calculate the character pool size
  let poolSize = 0
  if (hasUppercase) poolSize += 26
  if (hasLowercase) poolSize += 26
  if (hasNumbers) poolSize += 10
  if (hasSpecial) poolSize += 33 // Common special characters + foreign chars

  // Calculate entropy bits: log2(poolSize^length)
  const entropyBits = Math.floor(password.length * Math.log2(poolSize))

  return entropyBits
}

// Simulate the time needed to crack the password
function simulateCrackTime(bits) {
  // Assuming a modern computer can try 10 billion (10^10) passwords per second
  const attemptsPerSecond = 10000000000

  // Calculate the number of possible combinations: 2^bits
  const combinations = Math.pow(2, bits)

  // On average, half of the combinations need to be tried
  const avgAttempts = combinations / 2

  // Calculate time in seconds
  const seconds = avgAttempts / attemptsPerSecond

  // Convert to a human-readable format
  if (seconds < 60) {
    return `${Math.round(seconds)} secondes`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minutes`
  } else if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} heures`
  } else if (seconds < 31536000) {
    return `${Math.round(seconds / 86400)} jours`
  } else if (seconds < 31536000 * 100) {
    return `${Math.round(seconds / 31536000)} ans`
  } else if (seconds < 31536000 * 1000) {
    return `${Math.round(seconds / (31536000 * 100))} siècles`
  } else if (seconds < 31536000 * 1000000) {
    return `${Math.round(seconds / (31536000 * 1000))} millénaires`
  } else {
    return `${Math.round(seconds / (31536000 * 1000000))} millions d'années`
  }
}

// Simulate a cracking attempt
function simulateCrackingAttempt(password) {
  // In a real implementation, you might run some actual cracking algorithms
  // For this example, we'll use a simple heuristic

  // Check if the password has enough complexity
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  // Check for repeating patterns
  const hasRepeatingPatterns = /(.)\1{2,}/.test(password) // 3 or more of the same char

  // Check for sequential characters
  const hasSequential =
    /01234|12345|23456|34567|45678|56789|abcde|bcdef|cdefg|defgh|efghi|fghij|ghijk|hijkl|ijklm|jklmn|klmno|lmnop|nopqr|opqrs|pqrst|qrstu|rstuv|stuvw|tuvwx|uvwxy|vwxyz|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz/i.test(
      password,
    )

  // Simulate a 0.5% chance of successful cracking for even strong passwords
  // Replace crypto.randomInt with a compatible alternative
  const randomFactor = Math.floor(Math.random() * 1000) < 5

  // Consider the password crackable if it lacks complexity or has patterns
  return (
    randomFactor ||
    !hasUppercase ||
    !hasLowercase ||
    !hasNumbers ||
    !hasSpecial ||
    hasRepeatingPatterns ||
    hasSequential
  )
}

import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface PasswordValidatorProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
}

interface PasswordStrength {
  score: number; // 0-3
  level: 'weak' | 'vulnerable' | 'strong';
  requirements: {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}

const validatePassword = (password: string): PasswordStrength => {
  const requirements = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let score = 0;
  let level: 'weak' | 'vulnerable' | 'strong' = 'weak';

  if (metRequirements >= 4) {
    score = 3;
    level = 'strong';
  } else if (metRequirements >= 3) {
    score = 2;
    level = 'vulnerable';
  } else if (metRequirements >= 2) {
    score = 1;
    level = 'weak';
  }

  return { score, level, requirements };
};

export default function PasswordValidator({
  value,
  onChangeText,
  label = 'Contraseña',
  placeholder = 'Ingresa una contraseña segura',
}: PasswordValidatorProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = validatePassword(value);

  const getStrengthColor = () => {
    if (strength.score === 0) return colors.border;
    if (strength.score === 1) return '#DC4D3C'; // Rojo
    if (strength.score === 2) return '#FFB900'; // Amarillo
    return '#2E9E5B'; // Verde
  };

  const getStrengthText = () => {
    if (value.length === 0) return '';
    if (strength.level === 'weak') return 'Contraseña débil';
    if (strength.level === 'vulnerable') return 'Contraseña vulnerable';
    return 'Contraseña impenetrable';
  };

  const getStrengthMessage = () => {
    if (value.length === 0) return 'Crea una contraseña segura';
    if (strength.level === 'weak') return 'Necesita ser más fuerte';
    if (strength.level === 'vulnerable') return 'Casi lista, mejora un poco más';
    return 'Excelente nivel de seguridad';
  };

  const getBoxColor = (boxIndex: number) => {
    if (strength.score >= boxIndex + 1) return getStrengthColor();
    return colors.border;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {value.length > 0 && (
        <>
          <View style={styles.strengthIndicator}>
            <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
              {getStrengthText()}
            </Text>
            <Text style={styles.strengthMessage}>{getStrengthMessage()}</Text>
          </View>

          <View style={styles.boxContainer}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.strengthBox,
                  { backgroundColor: getBoxColor(index) },
                ]}
              />
            ))}
          </View>

          <View style={styles.requirementsContainer}>
            <RequirementItem
              text="Mínimo 8 caracteres"
              met={strength.requirements.hasMinLength}
            />
            <RequirementItem
              text="Mayúscula (A-Z)"
              met={strength.requirements.hasUpperCase}
            />
            <RequirementItem
              text="Minúscula (a-z)"
              met={strength.requirements.hasLowerCase}
            />
            <RequirementItem
              text="Número (0-9)"
              met={strength.requirements.hasNumbers}
            />
            <RequirementItem
              text="Carácter especial (!@#$%)"
              met={strength.requirements.hasSpecialChars}
            />
          </View>
        </>
      )}
    </View>
  );
}

interface RequirementItemProps {
  text: string;
  met: boolean;
}

function RequirementItem({ text, met }: RequirementItemProps) {
  return (
    <View style={styles.requirementItem}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={met ? '#2E9E5B' : colors.border}
        style={styles.requirementIcon}
      />
      <Text style={[styles.requirementText, { color: met ? colors.text : colors.textMuted }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -12,
    fontSize: 20,
  },
  strengthIndicator: {
    marginBottom: spacing.md,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  strengthMessage: {
    fontSize: 12,
    color: colors.textMuted,
  },
  boxContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  strengthBox: {
    flex: 1,
    height: 8,
    borderRadius: radius.sm,
  },
  requirementsContainer: {
    backgroundColor: '#F9FBFA',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  requirementIcon: {
    marginRight: spacing.sm,
    width: 20,
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
